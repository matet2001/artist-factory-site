import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'

export default function EmailInput({ ...form }) {
    const t = useTranslations('AUTH')

    return (
        <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('EMAIL_LABEL')}</FormLabel>
                    <FormControl>
                        <Input className='mt-1' type="email" placeholder={t('PLACEHOLDER.EMAIL')} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
