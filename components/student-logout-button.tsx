import { logoutStudent } from "@/app/actions/auth";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StudentLogoutButton() {
    return (
        <form action={logoutStudent}>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </form>
    );
}
