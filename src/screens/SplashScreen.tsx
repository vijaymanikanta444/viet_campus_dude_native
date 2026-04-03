import appConfig from '../../app.json';
import { SplashScreen as LayoutSplashScreen } from '../layout';

export function SplashScreen() {
  return (
    <LayoutSplashScreen appName={appConfig.displayName ?? appConfig.name} />
  );
}
