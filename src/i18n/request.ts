import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

// Static imports
import en from '../../messages/en.json'
import hu from '../../messages/hu.json'

const messages = {
    en,
    hu,
}

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

    return {
        locale,
        messages: messages[locale as keyof typeof messages],
    }
})
