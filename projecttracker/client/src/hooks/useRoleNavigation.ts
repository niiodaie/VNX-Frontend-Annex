import { useCallback } from 'react'
import { useLocation } from 'wouter'
import { redirectByRole } from '@/lib/roleRedirect'

export function useRoleNavigation() {
  const [, setLocation] = useLocation()

  const navigateByRole = useCallback(async () => {
    await redirectByRole(setLocation, {
      onError: (error) => {
        console.warn('Role navigation failed:', error.message)
        setLocation('/dashboard')
      }
    })
  }, [setLocation])

  return { navigateByRole }
}