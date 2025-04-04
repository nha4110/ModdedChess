import pygame
import asyncio
import platform

# Initialize Pygame
pygame.init()

# Constants
WIDTH = HEIGHT = 800
SQUARE_SIZE = WIDTH // 8
FPS = 60

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GRAY = (128, 128, 128)
LIGHT_BROWN = (245, 222, 179)
DARK_BROWN = (139, 69, 19)

# Piece images (using Unicode for simplicity, replace with actual images if desired)
PIECES = {
    'wp': '♙', 'wr': '♖', 'wn': '♘', 'wb': '♗', 'wq': '♕', 'wk': '♔',
    'bp': '♟', 'br': '♜', 'bn': '♞', 'bb': '♝', 'bq': '♛', 'bk': '♚'
}

# Initial board setup
INITIAL_BOARD = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
]

# Global variables
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Chess')
clock = pygame.time.Clock()
font = pygame.font.Font(None, 74)
board = [row[:] for row in INITIAL_BOARD]
selected = None
turn = 'white'
running = True

def draw_board():
    for row in range(8):
        for col in range(8):
            color = LIGHT_BROWN if (row + col) % 2 == 0 else DARK_BROWN
            pygame.draw.rect(screen, color, (col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))
            piece = board[row][col]
            if piece != '  ':
                text = font.render(PIECES[piece], True, BLACK if piece[0] == 'b' else WHITE)
                screen.blit(text, (col * SQUARE_SIZE + 15, row * SQUARE_SIZE + 15))

def is_valid_move(start, end):
    start_row, start_col = start
    end_row, end_col = end
    piece = board[start_row][start_col]
    
    if piece == '  ' or (piece[0] == 'w' and turn != 'white') or (piece[0] == 'b' and turn != 'black'):
        return False
    
    # Basic movement rules (simplified)
    piece_type = piece[1]
    row_diff = end_row - start_row
    col_diff = end_col - start_col
    
    if piece_type == 'p':  # Pawn
        direction = -1 if piece[0] == 'w' else 1
        if col_diff == 0 and board[end_row][end_col] == '  ':
            if row_diff == direction:
                return True
            if row_diff == 2 * direction and start_row == (1 if piece[0] == 'b' else 6):
                return True
        elif abs(col_diff) == 1 and row_diff == direction and board[end_row][end_col] != '  ':
            return True
    
    elif piece_type == 'r':  # Rook
        return (row_diff == 0 or col_diff == 0) and is_path_clear(start, end)
    
    elif piece_type == 'n':  # Knight
        return (abs(row_diff), abs(col_diff)) in [(1, 2), (2, 1)]
    
    elif piece_type == 'b':  # Bishop
        return abs(row_diff) == abs(col_diff) and is_path_clear(start, end)
    
    elif piece_type == 'q':  # Queen
        return (abs(row_diff) == abs(col_diff) or row_diff == 0 or col_diff == 0) and is_path_clear(start, end)
    
    elif piece_type == 'k':  # King
        return max(abs(row_diff), abs(col_diff)) == 1
    
    return False

def is_path_clear(start, end):
    start_row, start_col = start
    end_row, end_col = end
    row_step = 0 if start_row == end_row else (1 if end_row > start_row else -1)
    col_step = 0 if start_col == end_col else (1 if end_col > start_col else -1)
    steps = max(abs(end_row - start_row), abs(end_col - start_col))
    
    for i in range(1, steps):
        row = start_row + i * row_step
        col = start_col + i * col_step
        if board[row][col] != '  ':
            return False
    return True

def move_piece(start, end):
    global turn
    if is_valid_move(start, end):
        board[end[0]][end[1]] = board[start[0]][start[1]]
        board[start[0]][start[1]] = '  '
        turn = 'black' if turn == 'white' else 'white'
        return True
    return False

async def main():
    global selected, running
    
    def setup():
        screen.fill(WHITE)
        draw_board()
        pygame.display.flip()

    def update_loop():
        global selected, running
        
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN and running:
                pos = pygame.mouse.get_pos()
                row, col = pos[1] // SQUARE_SIZE, pos[0] // SQUARE_SIZE
                if selected:
                    if move_piece(selected, (row, col)):
                        selected = None
                    else:
                        selected = (row, col) if board[row][col] != '  ' else None
                else:
                    selected = (row, col) if board[row][col] != '  ' else None
        
        screen.fill(WHITE)
        draw_board()
        if selected:
            pygame.draw.rect(screen, GRAY, (selected[1] * SQUARE_SIZE, selected[0] * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE), 5)
        pygame.display.flip()
        clock.tick(FPS)

    setup()
    while running:
        update_loop()
        await asyncio.sleep(1.0 / FPS)

if platform.system() == "Emscripten":
    asyncio.ensure_future(main())
else:
    if __name__ == "__main__":
        asyncio.run(main())
        pygame.quit()