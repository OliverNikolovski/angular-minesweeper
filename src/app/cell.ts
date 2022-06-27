export interface Cell {
    i: number,
    j: number,
    state: 'opened' | 'unopened' | 'flagged',
    isMined: boolean,
    content: number | '🚩' | '💣' | null
}