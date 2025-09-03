import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { GlobalContextProviders } from "./components/_globalContextProviders";
import Page_0 from "./pages/menu.tsx";
import PageLayout_0 from "./pages/menu.pageLayout.tsx";
import Page_1 from "./pages/admin.tsx";
import PageLayout_1 from "./pages/admin.pageLayout.tsx";
import Page_2 from "./pages/login.tsx";
import PageLayout_2 from "./pages/login.pageLayout.tsx";
import Page_3 from "./pages/staff.tsx";
import PageLayout_3 from "./pages/staff.pageLayout.tsx";
import Page_4 from "./pages/_index.tsx";
import PageLayout_4 from "./pages/_index.pageLayout.tsx";
import Page_5 from "./pages/events.tsx";
import PageLayout_5 from "./pages/events.pageLayout.tsx";
import Page_6 from "./pages/contact.tsx";
import PageLayout_6 from "./pages/contact.pageLayout.tsx";
import Page_7 from "./pages/gallery.tsx";
import PageLayout_7 from "./pages/gallery.pageLayout.tsx";
import Page_8 from "./pages/admin.media.tsx";
import PageLayout_8 from "./pages/admin.media.pageLayout.tsx";
import Page_9 from "./pages/admin.pages.tsx";
import PageLayout_9 from "./pages/admin.pages.pageLayout.tsx";
import Page_10 from "./pages/admin.events.tsx";
import PageLayout_10 from "./pages/admin.events.pageLayout.tsx";
import Page_11 from "./pages/performances.tsx";
import PageLayout_11 from "./pages/performances.pageLayout.tsx";
import Page_12 from "./pages/admin.gallery.tsx";
import PageLayout_12 from "./pages/admin.gallery.pageLayout.tsx";
import Page_13 from "./pages/admin.bookings.tsx";
import PageLayout_13 from "./pages/admin.bookings.pageLayout.tsx";
import Page_14 from "./pages/admin.navigation.tsx";
import PageLayout_14 from "./pages/admin.navigation.pageLayout.tsx";
import Page_15 from "./pages/admin.performances.tsx";
import PageLayout_15 from "./pages/admin.performances.pageLayout.tsx";
import Page_16 from "./pages/admin.site-settings.tsx";
import PageLayout_16 from "./pages/admin.site-settings.pageLayout.tsx";
import Page_17 from "./pages/admin.editor.$pageId.tsx";
import PageLayout_17 from "./pages/admin.editor.$pageId.pageLayout.tsx";

if (!window.requestIdleCallback) {
  window.requestIdleCallback = (cb) => {
    setTimeout(cb, 1);
  };
}

import "./base.css";

const fileNameToRoute = new Map([["./pages/menu.tsx","/menu"],["./pages/admin.tsx","/admin"],["./pages/login.tsx","/login"],["./pages/staff.tsx","/staff"],["./pages/_index.tsx","/"],["./pages/events.tsx","/events"],["./pages/contact.tsx","/contact"],["./pages/gallery.tsx","/gallery"],["./pages/admin.media.tsx","/admin/media"],["./pages/admin.pages.tsx","/admin/pages"],["./pages/admin.events.tsx","/admin/events"],["./pages/performances.tsx","/performances"],["./pages/admin.gallery.tsx","/admin/gallery"],["./pages/admin.bookings.tsx","/admin/bookings"],["./pages/admin.navigation.tsx","/admin/navigation"],["./pages/admin.performances.tsx","/admin/performances"],["./pages/admin.site-settings.tsx","/admin/site-settings"],["./pages/admin.editor.$pageId.tsx","/admin/editor/:pageId"]]);
const fileNameToComponent = new Map([
    ["./pages/menu.tsx", Page_0],
["./pages/admin.tsx", Page_1],
["./pages/login.tsx", Page_2],
["./pages/staff.tsx", Page_3],
["./pages/_index.tsx", Page_4],
["./pages/events.tsx", Page_5],
["./pages/contact.tsx", Page_6],
["./pages/gallery.tsx", Page_7],
["./pages/admin.media.tsx", Page_8],
["./pages/admin.pages.tsx", Page_9],
["./pages/admin.events.tsx", Page_10],
["./pages/performances.tsx", Page_11],
["./pages/admin.gallery.tsx", Page_12],
["./pages/admin.bookings.tsx", Page_13],
["./pages/admin.navigation.tsx", Page_14],
["./pages/admin.performances.tsx", Page_15],
["./pages/admin.site-settings.tsx", Page_16],
["./pages/admin.editor.$pageId.tsx", Page_17],
  ]);

function makePageRoute(filename: string) {
  const Component = fileNameToComponent.get(filename);
  return <Component />;
}

function toElement({
  trie,
  fileNameToRoute,
  makePageRoute,
}: {
  trie: LayoutTrie;
  fileNameToRoute: Map<string, string>;
  makePageRoute: (filename: string) => React.ReactNode;
}) {
  return [
    ...trie.topLevel.map((filename) => (
      <Route
        key={fileNameToRoute.get(filename)}
        path={fileNameToRoute.get(filename)}
        element={makePageRoute(filename)}
      />
    )),
    ...Array.from(trie.trie.entries()).map(([Component, child], index) => (
      <Route
        key={index}
        element={
          <Component>
            <Outlet />
          </Component>
        }
      >
        {toElement({ trie: child, fileNameToRoute, makePageRoute })}
      </Route>
    )),
  ];
}

type LayoutTrieNode = Map<
  React.ComponentType<{ children: React.ReactNode }>,
  LayoutTrie
>;
type LayoutTrie = { topLevel: string[]; trie: LayoutTrieNode };
function buildLayoutTrie(layouts: {
  [fileName: string]: React.ComponentType<{ children: React.ReactNode }>[];
}): LayoutTrie {
  const result: LayoutTrie = { topLevel: [], trie: new Map() };
  Object.entries(layouts).forEach(([fileName, components]) => {
    let cur: LayoutTrie = result;
    for (const component of components) {
      if (!cur.trie.has(component)) {
        cur.trie.set(component, {
          topLevel: [],
          trie: new Map(),
        });
      }
      cur = cur.trie.get(component)!;
    }
    cur.topLevel.push(fileName);
  });
  return result;
}

function NotFound() {
  return (
    <div>
      <h1>Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p>Go back to the <a href="/" style={{ color: 'blue' }}>home page</a>.</p>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <GlobalContextProviders>
        <Routes>
          {toElement({ trie: buildLayoutTrie({
"./pages/menu.tsx": PageLayout_0,
"./pages/admin.tsx": PageLayout_1,
"./pages/login.tsx": PageLayout_2,
"./pages/staff.tsx": PageLayout_3,
"./pages/_index.tsx": PageLayout_4,
"./pages/events.tsx": PageLayout_5,
"./pages/contact.tsx": PageLayout_6,
"./pages/gallery.tsx": PageLayout_7,
"./pages/admin.media.tsx": PageLayout_8,
"./pages/admin.pages.tsx": PageLayout_9,
"./pages/admin.events.tsx": PageLayout_10,
"./pages/performances.tsx": PageLayout_11,
"./pages/admin.gallery.tsx": PageLayout_12,
"./pages/admin.bookings.tsx": PageLayout_13,
"./pages/admin.navigation.tsx": PageLayout_14,
"./pages/admin.performances.tsx": PageLayout_15,
"./pages/admin.site-settings.tsx": PageLayout_16,
"./pages/admin.editor.$pageId.tsx": PageLayout_17,
}), fileNameToRoute, makePageRoute })} 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GlobalContextProviders>
    </BrowserRouter>
  );
}
