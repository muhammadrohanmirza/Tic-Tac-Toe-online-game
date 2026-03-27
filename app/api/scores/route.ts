import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const saveScoreSchema = z.object({
  result: z.enum(["win", "loss", "draw"]),
  opponent: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { result, opponent } = saveScoreSchema.parse(body);

    await prisma.score.create({
      data: {
        userId: session.user.id,
        game: "tictactoe",
        result,
        opponent: opponent || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Scores error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save score" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const game = searchParams.get("game") || "tictactoe";

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        scores: {
          where: { game },
          select: {
            result: true,
          },
        },
      },
      where: {
        scores: {
          some: {
            game,
          },
        },
      },
    });

    const leaderboard = users
      .map((user) => {
        const wins = user.scores.filter((s) => s.result === "win").length;
        const losses = user.scores.filter((s) => s.result === "loss").length;
        const draws = user.scores.filter((s) => s.result === "draw").length;
        const totalGames = user.scores.length;
        return {
          rank: 0,
          userId: user.id,
          userName: user.name,
          wins,
          losses,
          draws,
          totalGames,
          winRate: totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0,
        };
      })
      .sort((a, b) => b.wins - a.wins || b.winRate - a.winRate)
      .slice(0, 10)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    return NextResponse.json({ success: true, leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
