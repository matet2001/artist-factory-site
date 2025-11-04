export default function AuthHeader({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}
