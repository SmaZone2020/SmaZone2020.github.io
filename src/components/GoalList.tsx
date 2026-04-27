import { LogoMermaid, Check, Xmark } from "@gravity-ui/icons";
import { Card, CardHeader, CheckboxGroup, Checkbox, Label, Description } from "@heroui/react";
import { siteConfig } from "../config/site";
import { useI18n } from "../i18n";

function GolaList() {
    const { t } = useI18n();
    
    return(
        <Card className='mb-4'>
            <CardHeader>
                <div className='flex items-center gap-2'>
                    <LogoMermaid className='w-5 h-5'/>
                    {t("common.goal")}
                </div>
            </CardHeader>
            <CheckboxGroup name="interests">
                {siteConfig.goals.map((goal) => (
                    <Checkbox key={goal.name} value={goal.name} isSelected={true}>
                        <Checkbox.Control>
                            <Checkbox.Indicator>
                                {() =>
                                    goal.isOk ? (
                                        <Check />
                                    ) : <Xmark />
                                }
                            </Checkbox.Indicator>
                        </Checkbox.Control>
                        <Checkbox.Content>
                            <div className="flex flex-col">
                                <Label>{goal.name}</Label>
                                <Description>{goal.description}</Description>
                            </div>
                        </Checkbox.Content>
                    </Checkbox>
                ))}
            </CheckboxGroup>
        </Card>
    )
}
export default GolaList