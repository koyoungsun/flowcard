// src/types.ts

export type LinkCard = {
    title: string
    url: string
    summary?: string
    tags?: string[]
  }
  
  export type LinkGroup = {
    groupName: string
    groupTags?: string[]
    cards: LinkCard[]
  }