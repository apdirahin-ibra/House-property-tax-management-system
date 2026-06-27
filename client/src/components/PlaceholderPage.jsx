import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Coming in Phase 6</CardTitle>
          <CardDescription>
            This page will be implemented with full tables, forms, and API integration in the next phase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The navigation, authentication, and layout are ready. Feature pages will connect to the backend APIs next.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
