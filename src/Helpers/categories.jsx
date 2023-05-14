import React,{useState} from 'react'

export function UpdateCheckboxes(selectedOption) {
    const [checkboxes, setCheckboxes] = useState([]);
    switch (selectedOption) {
        case "developer":
            setCheckboxes([
            { label: "HTML", checked: false },
            { label: "CSS", checked: false },
            { label: "JavaScript", checked: false },
            { label: "React", checked: false },
            ]);
            break;
        case "designer":
            setCheckboxes([
            { label: "Photoshop", checked: false },
            { label: "Illustrator", checked: false },
            { label: "Sketch", checked: false },
            { label: "Figma", checked: false },
            ]);
            break;
        case "writer":
            setCheckboxes([
            { label: "Copywriting", checked: false },
            { label: "Content writing", checked: false },
            { label: "Technical writing", checked: false },
            { label: "Creative writing", checked: false },
            ]);
            break;
        case "manager":
            setCheckboxes([
            { label: "Project management", checked: false },
            { label: "Team management", checked: false },
            { label: "Time management", checked: false },
            { label: "Task delegation", checked: false },
            ]);
            break;
        case "photography":
            setCheckboxes([
            { label: "Landscape photography", checked: false },
            { label: "Portrait photography", checked: false },
            { label: "Event photography", checked: false },
            { label: "Product photography", checked: false },
            ]);
            break;
        case "ai":
            setCheckboxes([
            { label: "Machine learning", checked: false },
            { label: "Deep learning", checked: false },
            { label: "Neural networks", checked: false },
            { label: "Natural language processing", checked: false },
            ]);
            break;
        default:
            setCheckboxes([]);
            break;
        }
    }
    const options = [
        {
            value: "developer",
            label: "Developer",
            checkboxes: [
                { value: "front-end", label: "Front-end" },
                { value: "back-end", label: "Back-end" },
                { value: "full-stack", label: "Full Stack" },
                { value: "React", label: "React" },
                { value: "java", label: "Java" },
            ],
            },
            {
            value: "designer",
            label: "Designer",
            checkboxes: [
                { value: "graphic", label: "Graphic" },
                { value: "web", label: "Web" },
                { value: "illustrator", label: "Illustrator" },
                { value: "Sketch", label: "Sketch" },
                { value: "UI/UX", label: "UI/UX" },
            ],
            },
            {
                value: "writer",
                label: "Writer",
                checkboxes: [
                { value: "copywriting", label: "Copywriting" },
                { value: "content writing", label: "Content writing" },
                { value: "technical writing", label: "Technical writing" },
                { value: "creative writing", label: "Creative writing" },
                ],
            },
            {
                value: "manager",
                label: "Manager",
                checkboxes: [
                    { value: "project management", label: "Project management" },
                    { value: "team management", label: "Team management" },
                    { value: "time management", label: "Time management" },
                    { value: "task delegation", label: "Task delegation" },
                ],
            },
            // Add other options here...
        ];