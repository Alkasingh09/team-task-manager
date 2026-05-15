import AuthBranding from './AuthBranding.jsx';
import AuthForm from './AuthForm.jsx';

export default function AuthShell({ title, subtitle, children, formPadding }) {
  return (
    <main className="min-h-screen grid lg:grid-cols-[3fr_2fr]">
      <AuthBranding />
      <AuthForm title={title} subtitle={subtitle} topPadding={formPadding || 'pt-8'}>
        {children}
      </AuthForm>
    </main>
  );
}