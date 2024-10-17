import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function FormControls({ formControls = [], formData, setFormData}) {
    function renderComponentByType(getControlItem){
        let element = null;
        switch(getControlItem.componentType) {
            case 'input':
                element = <Input
                id = {getControlItem.name}
                name = {getControlItem.name}
                placeholder = {getControlItem.placeholder}
                type = {getControlItem.type}
                />
                break;
            case 'select':
                element = (
                <Select>
                    <SelectTrigger className = "w-full">
                        <SelectValue placeholder = {getControlItem.label}/>
                    </SelectTrigger>
                    <SelectContent>
                    {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
                    </SelectContent>
                </Select>
                )
                break;

            case 'textarea':
                element = ( <Textarea
                id = {getControlItem.name}
                name = {getControlItem.name}
                placeholder = {getControlItem.placeholder}

                />
                );
                break;

            default:
                element = (<Input
                id = {getControlItem.name}
                name = {getControlItem.name}
                placeholder = {getControlItem.placeholder}
                type = {getControlItem.type}
                />
                )             
                break;
        }
        return element;  // 이 줄을 추가했습니다.
    }
    return (
        <div className="flex flex-col gap-3">
      {formControls.map((controlItem) => (
        <div key={controlItem.name}>
          <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
          {renderComponentByType(controlItem)}
        </div>
      ))}
        </div>
      );
    }


export default FormControls;