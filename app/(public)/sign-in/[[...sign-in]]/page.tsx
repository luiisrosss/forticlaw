import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <SignIn
      fallbackRedirectUrl="/dashboard"
      appearance={{
        variables: {
          colorBackground: '#0a0a0a',
          colorText: '#f4f4f5',
          colorInputBackground: '#09090b',
          colorInputText: '#f4f4f5',
          colorPrimary: '#ffffff',
          borderRadius: '999px',
        },
        elements: {
          card: 'shadow-none border border-white/10',
        },
      }}
    />
  )
}
