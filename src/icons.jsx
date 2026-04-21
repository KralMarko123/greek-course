const paths = {
  book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H7a3 3 0 0 0-3 3V5.5Zm3 13.5h13M7 3v15",
  file: "M7 3h7l5 5v13H7V3Zm7 0v6h5M10 13h6M10 17h6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  close: "M6 6l12 12M18 6 6 18",
  external: "M14 4h6v6M20 4l-9 9M19 14v5H5V5h5",
  grid: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z",
  image: "M4 5h16v14H4V5Zm3 11 4-5 3 4 2-2 3 3M8.5 9A1.5 1.5 0 1 0 8.5 6a1.5 1.5 0 0 0 0 3Z",
  search: "M11 19a8 8 0 1 1 5.7-2.4L21 21",
  video: "M4 6h11v12H4V6Zm11 4 5-3v10l-5-3"
};

export default function Icon({ name }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d={paths[name]} />
    </svg>
  );
}
