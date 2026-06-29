export const useLang = () => {
  const langCookie = useCookie<'en' | 'es'>('lang', {
    maxAge: 60 * 60 * 24 * 365,
    default: () => 'en'
  })

  const lang = useState<'en' | 'es'>('lang', () => langCookie.value ?? 'en')

  const setLang = (value: 'en' | 'es') => {
    lang.value = value
    langCookie.value = value
  }

  const t = (en: string, es: string): string => {
    return lang.value === 'es' ? es : en
  }

  return { lang, setLang, t }
}
