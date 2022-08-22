declare module "*.module.css";

interface Window {
    demoData: Array<{
        name: string,
        description: string,
        tags: string[],
        demoFile: string
    }>;
}