export interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

export interface StatItemData {
  value: number;
  label: string;
  suffix: string;
}

export interface ImageData {
  src: string;
  alt: string;
}
