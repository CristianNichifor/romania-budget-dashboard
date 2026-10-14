import {
  sankey as d3Sankey,
  sankeyLinkHorizontal,
  type SankeyExtraProperties,
  type SankeyGraph,
  type SankeyLink,
  type SankeyNode,
} from "d3-sankey";
import { useLingui } from "@lingui/react";
import { useMemo, useState } from "react";
import type { BudgetSummary } from "../../api/client";
import type { BudgetDestination } from "../../data/budget2026";
import { formatMilliardeLei } from "../../lib/format";
import { m } from "../../messages";
import {
  buildBudgetSankey,
  type GroupedDestination,
  SANKEY_BUDGET_NODE_ID,
  SANKEY_DEFICIT_NODE_ID,
  SANKEY_REST_NODE_ID,
  SANKEY_REVENUE_NODE_ID,
} from "../../lib/sankey";

type SankeyNodeExtra = SankeyExtraProperties & {
  id: string;
  name: string;
};

type SankeyLinkExtra = SankeyExtraProperties & {
  value: number;
};

type SankeyNodeD = SankeyNode<SankeyNodeExtra, SankeyLinkExtra>;
type SankeyLinkD = SankeyLink<SankeyNodeExtra, SankeyLinkExtra>;
type SankeyGraphD = SankeyGraph<SankeyNodeD, SankeyLinkD>;

const WIDTH = 960;
const HEIGHT = 480;
/** Flows thinner than this get no inline amount; it would overlap its neighbours. */
const MIN_LABELLED_LINK_WIDTH = 14;

function nodeColor(id: string): string {
  if (id === SANKEY_REVENUE_NODE_ID) {
    return "#0f766e";
  }
  if (id === SANKEY_BUDGET_NODE_ID) {
    return "#475569";
  }
  if (id === SANKEY_DEFICIT_NODE_ID) {
    return "#dc2626";
  }
  if (id === SANKEY_REST_NODE_ID) {
    return "#94a3b8";
  }
  return "#2563eb";
}

function computeLayout(
  summary: BudgetSummary,
  destinations: BudgetDestination[]
): { graph: SankeyGraphD; grouped: GroupedDestination[] } {
  const data = buildBudgetSankey({
    revenue: summary.revenue,
    expenditure: summary.expenditure,
    deficit: summary.deficit,
    destinations,
  });

  const generator = d3Sankey<SankeyNodeD, SankeyLinkD>()
    .nodeId((node) => node.id)
    .nodeWidth(16)
    .nodePadding(12)
    .nodeSort(null)
    .extent([
      [1, 1],
      [WIDTH - 1, HEIGHT - 1],
    ]);

  return {
    graph: generator({
      nodes: data.nodes.map((node) => ({ ...node, value: 0 })),
      links: data.links.map((link) => ({ ...link })),
    }),
    grouped: data.grouped,
  };
}

function isDestinationNode(id: string): boolean {
  return (
    id !== SANKEY_REVENUE_NODE_ID &&
    id !== SANKEY_DEFICIT_NODE_ID &&
    id !== SANKEY_BUDGET_NODE_ID &&
    id !== SANKEY_REST_NODE_ID
  );
}

interface BudgetSankeyProps {
  summary: BudgetSummary;
  destinations: BudgetDestination[];
  selectableIds?: ReadonlySet<string>;
  onSelect?: (destinationId: string) => void;
}

export function BudgetSankey({
  summary,
  destinations,
  selectableIds,
  onSelect,
}: BudgetSankeyProps) {
  const { graph, grouped } = useMemo(
    () => computeLayout(summary, destinations),
    [summary, destinations]
  );
  const [restOpen, setRestOpen] = useState(false);
  const linkPath = sankeyLinkHorizontal<SankeyNodeD, SankeyLinkD>();

  const { i18n } = useLingui();

  const labelFor = (node: SankeyNodeD): string => {
    switch (node.id) {
      case SANKEY_REVENUE_NODE_ID:
        return i18n._(m["sankey.node.revenue"]);
      case SANKEY_DEFICIT_NODE_ID:
        return i18n._(m["sankey.node.deficit"]);
      case SANKEY_BUDGET_NODE_ID:
        return i18n._(m["sankey.node.budget"]);
      case SANKEY_REST_NODE_ID:
        return i18n._(m["sankey.node.rest"]);
      default:
        return node.name;
    }
  };

  const svg = (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full"
      role="img"
      aria-label={i18n._(m["sankey.ariaLabel"])}
    >
      {graph.links.map((link, index) => {
        const path = linkPath(link);
        const source = link.source;
        const target = link.target;

        if (
          path === null ||
          typeof source === "string" ||
          typeof source === "number" ||
          typeof target === "string" ||
          typeof target === "number" ||
          source.x1 === undefined ||
          source.y0 === undefined ||
          target.x0 === undefined ||
          target.y0 === undefined ||
          link.width === undefined
        ) {
          return null;
        }

        const middleX = (source.x1 + target.x0) / 2;
        const middleY = (source.y0 + target.y0 + link.width) / 2;
        const sourceId =
          typeof source === "object" && "id" in source ? String(source.id) : "";

        return (
          <g key={index}>
            <path
              d={path}
              fill="none"
              stroke={nodeColor(sourceId)}
              strokeOpacity={0.38}
              strokeWidth={Math.max(2.5, link.width)}
            />
            {link.width >= MIN_LABELLED_LINK_WIDTH && (
              <text
                x={middleX}
                y={middleY}
                textAnchor="middle"
                fontSize={10}
                fill="#475569"
              >
                {formatMilliardeLei(link.value)}
              </text>
            )}
          </g>
        );
      })}
      {graph.nodes.map((node) => {
        if (
          node.x0 === undefined ||
          node.x1 === undefined ||
          node.y0 === undefined ||
          node.y1 === undefined
        ) {
          return null;
        }

        const isLeftColumn = node.x0 < WIDTH / 2;
        const labelX = isLeftColumn ? node.x1 + 6 : node.x0 - 6;
        const labelAnchor = isLeftColumn ? "start" : "end";
        const isRest = node.id === SANKEY_REST_NODE_ID;
        const isClickable =
          selectableIds?.has(node.id) === true ||
          (isRest && grouped.length > 0);
        const amountLabel =
          isDestinationNode(node.id) || isRest
            ? formatMilliardeLei(node.value ?? 0)
            : null;

        return (
          <g key={node.id}>
            <rect
              x={node.x0}
              y={node.y0}
              width={node.x1 - node.x0}
              height={node.y1 - node.y0}
              fill={nodeColor(node.id)}
              rx={2}
              className={
                isClickable
                  ? "cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-budget-blue"
                  : undefined
              }
              tabIndex={isClickable ? 0 : undefined}
              role={isClickable ? "button" : undefined}
              aria-label={
                isClickable
                  ? i18n._({
                      ...m["sankey.openDestination"],
                      values: { destination: labelFor(node) },
                    })
                  : undefined
              }
              onClick={() => {
                if (isRest) {
                  setRestOpen(true);
                } else if (isClickable && onSelect !== undefined) {
                  onSelect(node.id);
                }
              }}
              onKeyDown={(event) => {
                if (
                  isClickable &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  if (isRest) {
                    setRestOpen(true);
                  } else if (onSelect !== undefined) {
                    onSelect(node.id);
                  }
                }
              }}
            >
              <title>
                {amountLabel === null
                  ? labelFor(node)
                  : `${labelFor(node)} — ${amountLabel}`}
              </title>
            </rect>
            <text
              x={labelX}
              y={node.y0 + (node.y1 - node.y0) / 2 + 3}
              textAnchor={labelAnchor}
              fontSize={11}
              fill="#0f172a"
              fontWeight={600}
            >
              {labelFor(node)}
              {amountLabel !== null && (
                <tspan fill="#475569" fontWeight={400}>
                  {` · ${amountLabel}`}
                </tspan>
              )}
            </text>
          </g>
        );
      })}
    </svg>
  );

  const listNodes = graph.nodes.filter(
    (node): node is SankeyNodeD & { value: number } =>
      typeof node.value === "number" && node.value > 0
  );

  return (
    <div>
      {/* Under 640 px the flow is read as an ordered list (design F2.7). */}
      <div className="hidden sm:block">{svg}</div>
      <ol
        className="space-y-1 text-sm sm:hidden"
        aria-label={i18n._(m["sankey.mobileList"])}
        data-testid="sankey-mobile-list"
      >
        {listNodes.map((node) => (
          <li
            key={node.id}
            className="flex justify-between gap-4 border-b border-slate-100 py-1"
          >
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block size-2.5 rounded-sm"
                style={{ backgroundColor: nodeColor(node.id) }}
              />
              {labelFor(node)}
            </span>
            <span className="tabular-nums text-slate-600">
              {formatMilliardeLei(node.value)}
            </span>
          </li>
        ))}
      </ol>
      {grouped.length > 0 && (
        <details
          className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          open={restOpen}
          onToggle={(event) => setRestOpen(event.currentTarget.open)}
          data-testid="sankey-rest-details"
        >
          <summary className="cursor-pointer font-medium text-slate-700">
            {i18n._({
              ...m["sankey.rest.summary"],
              values: { count: grouped.length },
            })}
          </summary>
          <ul className="mt-2 divide-y divide-slate-200">
            {grouped.map((destination) => (
              <li
                key={destination.id}
                className="flex justify-between gap-4 py-1 text-slate-600"
              >
                <span>{destination.name}</span>
                <span className="tabular-nums">
                  {formatMilliardeLei(destination.amount)}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
