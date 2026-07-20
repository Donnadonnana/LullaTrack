export function formatMinutes(
    totalMinutes: number,
  ): string {
    if (totalMinutes < 60) {
      return `${totalMinutes} min`;
    }
  
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    if (minutes === 0) {
      return `${hours} hr`;
    }
  
    return `${hours} hr ${minutes} min`;
  }
  
  export function formatFeedCount(
    count: number,
  ): string {
    return `${count} ${count === 1 ? "feed" : "feeds"}`;
  }