import FormControls from "./form-controls";
import { Button } from "@/components/ui/button"
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */


function CommonForm({handleSubmit, buttonText, formControls = [], formData, setFormData}) {
    return (
        <form onSubmit={handleSubmit}>
        <FormControls
            formControls={formControls}
            formData={formData}
            setFormData={setFormData}
        />
        <Button type = "submit">{buttonText || 'Submit'}</Button>    
        </form>
      );
}


export default CommonForm;
