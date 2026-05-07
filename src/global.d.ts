/**
 * The module for importing CSS files.
 */
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

/**
 * The type definition for the Node.js process object with additional properties.
 */
type ProcessType = NodeJS.Process & {
  browser: boolean;
  env: Record<string, string | undefined>;
};

/**
 * The global process object.
 */
declare let process: ProcessType;

/**
 * The type definition for the Hot Module object.
 */
// Note: Vite HMR module declaration removed — not applicable in Next.js
// interface HotModule { hot?: { status: () => string }; }
// declare const module: HotModule;

declare module "*?raw" {
  const content: string;
  export default content;
}

declare module "react-simple-maps" {
  import type { CSSProperties, ReactNode, MouseEvent, SVGProps, Ref } from "react";

  export interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
    parallels?: [number, number];
  }

  export interface GeoFeature {
    rsmKey: string;
    id: string | number;
    svgPath: string;
    [key: string]: unknown;
  }

  export interface GeographiesChildrenProps {
    geographies: GeoFeature[];
    outline: GeoFeature | null;
    borders: GeoFeature | null;
  }

  export interface GeographyStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    outline?: string;
    cursor?: string;
    [key: string]: unknown;
  }

  export interface ComposableMapProps extends SVGProps<SVGSVGElement> {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    className?: string;
    style?: CSSProperties;
  }

  export interface GeographiesProps {
    geography: string | object;
    parseGeographies?: (features: unknown[]) => unknown[];
    className?: string;
    children: (props: GeographiesChildrenProps) => ReactNode;
  }

  export interface GeographyProps {
    geography: GeoFeature;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
    style?: {
      default?: GeographyStyle;
      hover?: GeographyStyle;
      pressed?: GeographyStyle;
    };
    onMouseEnter?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseLeave?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseDown?: (event: MouseEvent<SVGPathElement>) => void;
    onMouseUp?: (event: MouseEvent<SVGPathElement>) => void;
    onClick?: (event: MouseEvent<SVGPathElement>) => void;
    onFocus?: (event: React.FocusEvent<SVGPathElement>) => void;
    onBlur?: (event: React.FocusEvent<SVGPathElement>) => void;
    ref?: Ref<SVGPathElement>;
  }

  export const ComposableMap: React.ForwardRefExoticComponent<ComposableMapProps & React.RefAttributes<SVGSVGElement>>;
  export const Geographies: React.ForwardRefExoticComponent<GeographiesProps & React.RefAttributes<SVGGElement>>;
  export const Geography: React.MemoExoticComponent<React.ForwardRefExoticComponent<GeographyProps & React.RefAttributes<SVGPathElement>>>;
}
