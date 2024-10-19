import FormControls from "./form-controls";
import { Button } from "@/components/ui/button"
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */


function CommonForm({
    handleSubmit,
    buttonText,
    formControls = [], 
    formData, 
    setFormData,
    //버튼 누르면 disabled
    isButtonDisabled = false
    }) {
    return (
        <form onSubmit={handleSubmit}>
        <FormControls
            formControls={formControls}
            formData={formData}
            setFormData={setFormData}
        />
        <Button disabled = {isButtonDisabled} type = "submit" className = "mt-5 w-full">{buttonText || 'Submit'}</Button>    
        </form>
      );
}


export default CommonForm;
