# BEAM Architecture Site

A modern, responsive website for BEAM Architecture showcasing innovative architectural projects, sustainable design solutions, and interactive city-based project exploration.

## 🏗️ Features

- **City Selector**: Interactive city selection with project filtering
- **3D Model Placeholders**: Visual representations of proposed buildings
- **Project Showcases**: Featured architectural projects with funding progress
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Smooth Animations**: Framer Motion powered interactions
- **Supabase Integration**: Ready for backend database integration
- **Stripe Ready**: Payment processing setup for project funding
- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **3D Graphics**: Three.js, React Three Fiber
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Stripe integration
- **Deployment**: Vercel ready

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Main page component
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── Hero.tsx             # Hero section
│   ├── CitySelector.tsx     # City selection component
│   ├── FeaturedProjects.tsx # Project showcase with 3D placeholders
│   ├── AboutSection.tsx     # Company information
│   ├── ContactSection.tsx   # Contact form and info
│   └── providers.tsx        # Context providers (Supabase, City)
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (optional)

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## 🎨 Customization

### Colors

The site uses a custom color palette defined in `tailwind.config.js`:

- `beam-primary`: Deep blue (#1a365d)
- `beam-secondary`: Dark gray (#2d3748)
- `beam-accent`: Blue (#3182ce)
- `beam-warm`: Orange (#ed8936)
- `beam-light`: Light gray (#f7fafc)

### Fonts

- **Display**: Playfair Display (for headings)
- **Body**: Inter (for body text)

### Adding New Cities

Update the cities array in `src/components/providers.tsx`:

```typescript
const cities: City[] = [
  {
    id: 'new-id',
    name: 'City Name',
    country: 'Country',
    coordinates: [lat, lng],
    projects: number
  }
]
```

## 🔧 Supabase Integration

The site is pre-configured for Supabase integration:

1. Create a new Supabase project
2. Set up your database tables for projects, cities, etc.
3. Configure authentication if needed
4. Update environment variables

## 💳 Stripe Integration

For payment processing:

1. Create a Stripe account
2. Get your API keys
3. Set up webhook endpoints
4. Configure environment variables

## 📱 Responsive Design

The site is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎭 Animations

Built with Framer Motion for smooth, performant animations:
- Page transitions
- Scroll-triggered animations
- Hover effects
- Loading states

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or support, please contact:
- Email: hello@beamarchitecture.com
- Website: [beamarchitecture.com](https://beamarchitecture.com)

---

Built with ❤️ by the BEAM Architecture team
