export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const index_ = Math.floor(Math.random() * (index + 1));
    const tempI = result[index];
    const tempJ = result[index_];
    
    if (tempI !== undefined && tempJ !== undefined) {
      result[index] = tempJ;
      result[index_] = tempI;
    }
  }
  return result;
}