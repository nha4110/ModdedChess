export interface GameOutcome {
    gameMode: string;
    winner: string | null;
  }
  
  export async function recordGameOutcome(outcome: GameOutcome) {
    try {
      if (outcome.winner !== null) {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No authentication token found. Skipping game outcome recording.');
          return;
        }
  
        console.log('Sending game outcome request:', outcome);
        const response = await fetch('/api/game-outcome', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(outcome),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Game outcome request failed:', errorText);
          throw new Error(errorText);
        }
  
        console.log('Game outcome recorded successfully');
      }
    } catch (error) {
      console.error('Error recording game outcome:', error);
    }
  }