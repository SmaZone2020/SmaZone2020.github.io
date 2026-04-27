import { Code } from "@gravity-ui/icons";
import { Card, CardHeader, Meter, Label } from "@heroui/react";
import { siteConfig } from "../config/site";
import { useI18n } from "../i18n";

function TechStack() {
    const { t } = useI18n();
    
    return (
        <Card className='mb-4'>
            <CardHeader>
                <div className='flex items-center gap-2'>
                    <Code className='w-5 h-5'/>
                    {t("common.tech")}
                </div>
            </CardHeader>
            {siteConfig.tech.map((tech) => (
                <Meter aria-label={tech.name} color={tech.color} className="w-full" value={tech.proficiency}>
                    <Label>{tech.name}</Label>
                    <Meter.Output />
                    <Meter.Track>
                        <Meter.Fill />
                    </Meter.Track>
                </Meter>
            ))}
        </Card>
    )
}

export default TechStack