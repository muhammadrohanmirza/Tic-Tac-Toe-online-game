import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createRoomSchema = z.object({
  isPublic: z.boolean().default(true),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const rooms = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        scores: {
          where: { game: "tictactoe" },
          select: {
            result: true,
            createdAt: true,
          },
        },
      },
      where: {
        scores: {
          some: {
            game: "tictactoe",
          },
        },
      },
      take: 10,
    });

    const leaderboard = rooms.map((user, index) => {
      const wins = user.scores.filter((s) => s.result === "win").length;
      const totalGames = user.scores.length;
      return {
        rank: index + 1,
        userId: user.id,
        userName: user.name,
        wins,
        totalGames,
        winRate: totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0,
      };
    });

    leaderboard.sort((a, b) => b.wins - a.wins);

    return NextResponse.json({ success: true, leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

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
    const { isPublic } = createRoomSchema.parse(body);

    return NextResponse.json({
      success: true,
      message: "Room creation handled via WebSocket",
      isPublic,
    });
  } catch (error) {
    console.error("Rooms error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process request" },
      { status: 500 }
    );
  }
}
