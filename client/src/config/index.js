export const singUpFormControls = [
    {
    name: 'userName',
    label: 'User Name',
    placeholder: 'Enter your user name',
    type: 'Text',
    componentType: 'input'
    },

    {
    name: 'userEmail',
    label: 'User email',
    placeholder: 'Enter your email ',
    type: 'Text',
    componentType: 'input'    
    },

    {
    name: 'password',
    label: 'User password',
    placeholder: 'Enter your password',
    type: 'Text',
    componentType: 'input'    
    },
]

export const singInFormControls = [

    {
    name: 'userEmail',
    label: 'User email',
    placeholder: 'Enter your email ',
    type: 'Text',
    componentType: 'input'    
    },

    {
    name: 'password',
    label: 'User password',
    placeholder: 'Enter your password',
    type: 'Text',
    componentType: 'input'    
    },
]

export const initializeSignInFormData = 
    {
        userEmail: "",
        password: "",
    }

export const initializeSignUpFormData = 
    {   
        userName: "",
        userEmail: "",
        password: "",
    }

export const courseLandingPageFormControls = [
  {
    name: "title",
    label: "Title",
    componentType: "input",
    type: "text",
    placeholder: "Enter course title",
  },
  {
    name: "category",
    label: "Category",
    componentType: "select",
    type: "text",
    placeholder: "",
  },
  {
    name: "level",
    label: "Level",
    componentType: "select",
    type: "text",
    placeholder: "",
  },
  {
    name: "primaryLanguage",
    label: "Primary Language",
    componentType: "select",
    type: "text",
    placeholder: "",
  },
  {
    name: "subtitle",
    label: "Subtitle",
    componentType: "input",
    type: "text",
    placeholder: "Enter course subtitle",
  },
  {
    name: "description",
    label: "Description",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter course description",
  },
  {
    name: "pricing",
    label: "Pricing",
    componentType: "input",
    type: "number",
    placeholder: "Enter course pricing",
  },
  {
    name: "objectives",
    label: "Objectives",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter course objectives",
  },
  {
    name: "welcomeMessage",
    label: "Welcome Message",
    componentType: "textarea",
    placeholder: "Welcome message for students",
  },
];

export const courseLandingInitialFormData = {
  title: "",
  category: "",
  level: "",
  primaryLanguage: "",
  subtitle: "",
  description: "",
  pricing: "",
  objectives: "",
  welcomeMessage: "",
  image: "",
};

export const courseCurriculumInitialFormData = [
  {
    title: "",
    videoUrl: "",
    freePreview: false,
    public_id: "",
  },
];
