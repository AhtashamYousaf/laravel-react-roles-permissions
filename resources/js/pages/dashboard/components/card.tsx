import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function StatCard({
    description,
    cardTitle,
    badge,
    badgeIcon,
    footerIconTitle,
    footerIcon,
    footerDescription,
}: {
    description: string;
    cardTitle: string | number;
    badge: string;
    badgeIcon: React.ReactNode;
    footerIconTitle: string;
    footerIcon: React.ReactNode;
    footerDescription: string;
}) {
    return (
        <Card className="absolute inset-0 flex flex-col justify-between">
            <CardHeader className="relative">
                <CardDescription>{description}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{cardTitle}</CardTitle>
                <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                        {badgeIcon}
                        {badge}
                    </Badge>
                </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 p-4 pt-0 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {footerIconTitle} {footerIcon}
                </div>
                <div className="text-muted-foreground">{footerDescription}</div>
            </CardFooter>
        </Card>
    );
}
