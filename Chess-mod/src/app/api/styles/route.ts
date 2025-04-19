import { NextResponse } from 'next/server';

// List of available styles (matching the 20 styles you provided)
const STYLES = [
  'alpha',
  'anarcandy',
  'caliente',
  'cardinal',
  'cburnett',
  'celtic',
  'chess7',
  'chessnut',
  'companion',
  'cooke',
  'disguised',
  'dubrovny',
  'fantasy',
  'firi',
  'fresca',
  'gioco',
  'governor',
  'horsey',
  'icpieces',
  'kiwen-suwi',
];

// Piece types for mapping
const PIECE_TYPES = [
  'wP', 'bP',
  'wR', 'bR',
  'wN', 'bN',
  'wB', 'bB',
  'wQ', 'bQ',
  'wK', 'bK',
];

export async function GET() {
  try {
    const styles = STYLES.map((style) => ({
      name: style,
      pieces: PIECE_TYPES.reduce((acc, piece) => ({
        ...acc,
        [piece.toLowerCase()]: `/piece/${style}/${piece}.svg`,
      }), {} as Record<string, string>),
    }));

    return NextResponse.json({
      success: true,
      styles,
    }, { status: 200 });
  } catch (error) {
    console.error('Error generating styles:', error); // Use the error variable
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch styles',
    }, { status: 500 });
  }
}