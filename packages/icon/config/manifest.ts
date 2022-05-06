export interface InitialProps {
  [key: string]: any;
}
interface BaseVariantIcon {
  initialProps?: InitialProps;
}
export interface VariantImageIcon extends BaseVariantIcon {
  type: 'image';
  src: string;
}
export interface VariantPlatFormIcon extends BaseVariantIcon {
  type: 'platform';
  name: string;
}
export type VariantIcon = VariantImageIcon | VariantPlatFormIcon;

interface Variant {
  icon: VariantIcon;
  desc?: string;
  label: string;
  initialProps?: InitialProps;
  category?: string;
}

export default async function getManifest() {
  const res = await fetch('https://ofapkg.pek3b.qingstor.com/@one-for-all/icon@0.6.1/svgNameMap.json');
  const svgNameMap: Record<string, string[]> = await res.json();

  function getIconNameToVariant(category: string) {
    return (name: string): Variant => {
      return {
        "icon": {
          name,
          "type": "platform",
        },
        "desc": name,
        "label": name,
        category,
        "initialProps": {
          name,
          size: 12,
        }
      }
    }
  }

  function getVariants(): Variant[] {
    return Object.entries(svgNameMap).reduce((acc, [category, iconNames]) => {
      const newVariants = iconNames.map(getIconNameToVariant(category));
      return acc.concat(newVariants);
    }, []);
  }

  return {
    default: {
      variants: getVariants()
    }
  }
}
