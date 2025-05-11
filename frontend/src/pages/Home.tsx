import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
    return (
        <div className="container mx-auto py-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
                <p className="text-muted-foreground">This is a basic home page using shadcn components.</p>
            </header>

            <main className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Interactive Form</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Enter your name" />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Enter your email" />
                            </div>
                            <Button>Submit</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Button variant="outline">Action 1</Button>
                            <Button variant="outline">Action 2</Button>
                            <Button variant="outline">Action 3</Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
