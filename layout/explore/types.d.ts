import type { ExplorePageProps } from 'pages/data/explore/[[...dataset]]';

export interface ExploreLayoutProps extends ExplorePageProps {
  stopDrawing: () => void;
  userIsLoggedIn: boolean;
}
