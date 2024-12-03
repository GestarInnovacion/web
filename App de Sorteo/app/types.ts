export interface Prize {
    name: string
    range: [number, number]
  }
  
  export interface Participant {
    number: number
    name: string
    prize?: string
  }
  
  