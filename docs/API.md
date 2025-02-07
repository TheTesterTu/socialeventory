# API Documentation

## Authentication

### Login
```typescript
POST /auth/login
Content-Type: application/json

{
  "email": string,
  "password": string
}
```

### Register
```typescript
POST /auth/register
Content-Type: application/json

{
  "email": string,
  "password": string,
  "fullName": string
}
```

## Events

### Get Events
```typescript
GET /events
Query Parameters:
- page: number
- limit: number
- category?: string[]
- location?: [number, number]
- radius?: number
```

### Create Event
```typescript
POST /events
Content-Type: application/json

{
  "title": string,
  "description": string,
  "location": {
    "coordinates": [number, number],
    "address": string,
    "venue_name": string
  },
  "startDate": string,
  "endDate": string,
  "category": string[],
  "accessibility": {
    "languages": string[],
    "wheelchairAccessible": boolean,
    "familyFriendly": boolean
  },
  "pricing": {
    "isFree": boolean,
    "priceRange?: [number, number],
    "currency?: string
  }
}
```

### Update Event
```typescript
PUT /events/:id
Content-Type: application/json

{
  // Same as Create Event
}
```

### Delete Event
```typescript
DELETE /events/:id
```

## Social Interactions

### Like Event
```typescript
POST /events/:id/like
```

### Unlike Event
```typescript
DELETE /events/:id/like
```

### Add Comment
```typescript
POST /events/:id/comments
Content-Type: application/json

{
  "content": string
}
```

### Delete Comment
```typescript
DELETE /events/:id/comments/:commentId
```

## User Profile

### Get Profile
```typescript
GET /profile
```

### Update Profile
```typescript
PUT /profile
Content-Type: application/json

{
  "fullName": string,
  "avatar_url": string,
  "bio": string,
  "preferences": {
    "notifications": boolean,
    "theme": "light" | "dark"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

```typescript
{
  "error": {
    "code": string,
    "message": string,
    "details?: any
  }
}
```

Common error codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 429: Too Many Requests
- 500: Internal Server Error

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user

## Websocket Events

```typescript
// Event updates
socket.on('event:update', (data: Event) => {})

// New comments
socket.on('comment:new', (data: Comment) => {})

// Like updates
socket.on('event:like', (data: { eventId: string, count: number }) => {})
```