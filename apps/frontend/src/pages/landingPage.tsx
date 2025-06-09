import Logo from '@frontend/components/logo/logo';
import {
  TypographyCaption,
  TypographyH1,
  TypographyH3,
  TypographyH4,
  TypographyH5,
  TypographyLargeP,
  TypographyP,
} from '@frontend/components/typography/typography';
import { Button } from '@frontend/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@frontend/components/ui/card';
import { Separator } from '@frontend/components/ui/separator';
import PageShell from '@frontend/pageShell';
import { ArrowRight, Braces, CircleCheck, Cog, Database } from 'lucide-react';

export default function LandingPage() {
  return (
    <PageShell>
      {/* Navbar */}
      <section className="flex justify-between">
        <Logo withText={true} />
        <div className="flex items-center gap-2">
          <Button>Log In</Button>
          <Button variant="outline">Sign Up</Button>
        </div>
      </section>

      {/* Hero Section */}
      <section className="flex flex-col items-center gap-4 text-center md:gap-6">
        <TypographyH1>
          Mock Data That
          <span className="block text-neutral-500">Actually Works</span>
        </TypographyH1>
        <TypographyLargeP className="text-muted-foreground max-w-lg ">
          Create, validate, and manage mock data with schemas. Built for
          developers who demand reliability and speed.
        </TypographyLargeP>
        <Button>
          Start Building
          <ArrowRight />
        </Button>
      </section>

      <Separator />

      {/* Schema Image */}
      <section className="flex flex-col items-center gap-4  py-6 md:gap-6 md:py-12">
        <TypographyH3 className="text-center">
          Simple. Powerful. Reliable.
        </TypographyH3>
        <TypographyLargeP className="text-muted-foreground text-center">
          Define your schema once, get validated mock data everywhere.
        </TypographyLargeP>
        <div className="w-md md:w-2xl select-none rounded-2xl bg-black p-8">
          <div className="mb-6 flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-4 text-sm text-gray-400">schema.js</span>
          </div>

          <pre className="text-sm text-green-400">
            <code>
              {`// Define your schema
POST /api/myproject/schemas
{
  "name": "users",
  "fields": [
    {
      "name": "email",
      "type": "string",
      "validation": { "format": "email" }
    },
    {
      "name": "age",
      "type": "number",
      "validation": { "min": 18, "max": 100 }
    }
  ]
}

// Get validated mock data
GET /api/myproject/users
// Returns: [
//   { "email": "john@example.com", "age": 25 },
//   { "email": "jane@example.com", "age": 32 }
// ]`}
            </code>
          </pre>
        </div>
      </section>

      <Separator />

      {/* How it works */}
      <section className="flex flex-col items-center gap-4 text-center md:gap-6">
        <TypographyH3>How It Works</TypographyH3>
        <div className="flex flex-col gap-6 md:flex-row md:gap-24">
          <div className="flex flex-col items-center gap-2 ">
            <Braces />
            <TypographyH5>Define Schema</TypographyH5>
            <TypographyCaption className="text-muted-foreground max-w-3xs text-center ">
              Define custom data structures with advanced validation rules.
            </TypographyCaption>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Database />
            <TypographyH5>Store and Retrieve Data</TypographyH5>
            <TypographyCaption className="text-muted-foreground max-w-3xs text-center ">
              Use GET, POST, PUT, DELETE just like a real API.
            </TypographyCaption>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Cog />
            <TypographyH5>Manage</TypographyH5>
            <TypographyCaption className="text-muted-foreground max-w-3xs text-center ">
              Use the dashboard to monitor and manage your endpoints.
            </TypographyCaption>
          </div>
        </div>
      </section>

      <Separator />

      {/* Pricing */}
      <section className="flex flex-col items-center gap-4  py-6 md:gap-6 md:py-12">
        <TypographyH3>Simple, Transparent Pricing</TypographyH3>
        <div className="flex flex-col gap-6 md:flex-row md:gap-24">
          <Card>
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <CardDescription>Free. Forever</CardDescription>
            </CardHeader>
            <CardContent className=" flex flex-col gap-2">
              <TypographyH4>
                $0
                <span className="text-sm font-medium">/month</span>
              </TypographyH4>
              <TypographyP className="inline-flex gap-2">
                <CircleCheck color="#009689" />
                1 Project
              </TypographyP>
              <TypographyP className="inline-flex gap-2">
                <CircleCheck color="#009689" />
                Upto 3 Schemas
              </TypographyP>
              <TypographyP className="inline-flex gap-2">
                <CircleCheck color="#009689" />
                Upto 100 records per Schema
              </TypographyP>
              <TypographyP className="inline-flex gap-2">
                <CircleCheck color="#009689" />
                100 API calls per day
              </TypographyP>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>

          <Card className="bg-neutral-900 text-white">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>If you want more.</CardDescription>
            </CardHeader>
            <CardContent className=" flex flex-col gap-2">
              <TypographyH4>
                $15
                <span className="text-sm font-medium">/month</span>
              </TypographyH4>
              <TypographyP className="inline-flex gap-2">
                <CircleCheck color="#009689" />
                Upto 3 Projects
              </TypographyP>
              <TypographyP className="inline-flex gap-2">
                <CircleCheck color="#009689" />
                Unlimited Schemas
              </TypographyP>
              <TypographyP className="inline-flex gap-2">
                <CircleCheck color="#009689" />
                Upto 1000 records per Schema
              </TypographyP>
              <TypographyP className="inline-flex gap-2">
                <CircleCheck color="#009689" />
                1000 API calls per day
              </TypographyP>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">
                Get Pro
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Ready to Build */}

      <section className="flex flex-col items-center gap-4 text-center md:gap-6">
        <TypographyH3>Ready to Build Better?</TypographyH3>
        <TypographyLargeP className="text-muted-foreground text-center">
          Join Mockden for your mock data needs.
        </TypographyLargeP>
        <Button>
          Start for Free
          <ArrowRight />
        </Button>
      </section>
    </PageShell>
  );
}
