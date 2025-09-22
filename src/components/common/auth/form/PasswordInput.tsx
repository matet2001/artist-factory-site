import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function PasswordInput({ ...form }) {
    const [visible, setVisible] = useState(false)
    const t = useTranslations('AUTH')

    return (
        <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('PASSWORD_LABEL')}</FormLabel>
                    <FormControl>
                        <div className="relative mt-1">
                            <Input
                                type={visible ? 'text' : 'password'}
                                {...field}
                                placeholder={t('PLACEHOLDER.PASSWORD')}
                            />
                            <button
                                type="button"
                                onClick={() => setVisible(!visible)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
