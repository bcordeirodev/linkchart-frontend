"use client";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

import { Link } from "@/shared/components";
import { usePathname } from "@/shared/hooks";

import type { BreadcrumbsProps } from "@mui/material/Breadcrumbs";

type PageBreadcrumbProps = BreadcrumbsProps & {
  className?: string;
  skipHome?: boolean;
};

function PageBreadcrumb(props: PageBreadcrumbProps) {
  const { className, skipHome = false, sx, ...rest } = props;
  const pathname = usePathname();

  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .reduce(
      (acc: { title: string; url: string }[], part, index, array) => {
        const url = `/${array.slice(0, index + 1).join("/")}`;
        const title =
          part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");

        acc.push({ title, url });
        return acc;
      },
      skipHome ? [] : [],
    );

  return (
    <Breadcrumbs
      className={className}
      aria-label="breadcrumb"
      sx={{
        display: "flex",
        width: "100%",
        color: "text.secondary",
        "& .MuiBreadcrumbs-ol": { listStyle: "none", m: 0, p: 0 },
        "& .MuiBreadcrumbs-separator": { color: "text.disabled" },
        ...sx,
      }}
      {...rest}
    >
      {crumbs.map((item, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <Typography
            component={item.url ? Link : "span"}
            to={item.url}
            key={index}
            variant="body2"
            role="button"
            sx={{
              display: "block",
              fontWeight: 500,
              letterSpacing: "-0.025em",
              textTransform: "capitalize",
              maxWidth: 128,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: isLast ? "text.primary" : "text.secondary",
            }}
          >
            {item.title}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
}

export default PageBreadcrumb;
