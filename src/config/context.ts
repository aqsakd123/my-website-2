import { createContext } from 'react'

export type UserType = {
  role?: string | undefined
  id: number
  username: string
  token?: string
  refreshToken?: string
}

export type AppContextType = {
  /**
   * Session user
   */
  user: UserType | null

  /**
   * Save session user
   * @param {UserType} user
   */
  saveUser: (user: UserType) => void

  /**
   * Delete session user
   */
  removeUser: () => void

  /**
   * Check role of session user
   * @param {array|string} role
   */
  isRole: (role: string | string[]) => boolean
}

export const AppContext = createContext<AppContextType>({
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  saveUser: function (user: UserType): void {
    throw new Error('Function not implemented.')
  },
  removeUser: function (): void {
    throw new Error('Function not implemented.')
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isRole: function (role: string | string[]): boolean {
    throw new Error('Function not implemented.')
  },
})
