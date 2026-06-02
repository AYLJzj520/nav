import { Routes } from '@angular/router'
import { isSelfDevelop } from 'src/utils/utils'
import { getDefaultTheme } from 'src/utils'

export const routes: Routes = [
  {
    path: 'sim',
    loadComponent: () => import('src/view/sim/index.component'),
    data: {},
  },
  {
    path: 'super',
    loadComponent: () => import('src/view/super/index.component'),
    data: {},
  },
  {
    path: 'side',
    loadComponent: () => import('src/view/side/index.component'),
    data: {},
  },
  {
    path: 'shortcut',
    loadComponent: () => import('src/view/shortcut/index.component'),
    data: {},
  },

  {
    path: 'light',
    loadComponent: () => import('src/view/light/index.component'),
    data: {
      data: {},
    },
  },
  {
    path: 'app',
    loadComponent: () => import('src/view/mobile/index.component'),
    data: {},
  },
  {
    path: 'system',
    loadComponent: () => import('src/view/system/index.component'),
    children: [
      {
        path: 'info',
        loadComponent: () => import('src/view/system/info/index.component'),
      },
      {
        path: 'bookmark',
        loadComponent: () => import('src/view/system/bookmark/index.component'),
      },
      {
        path: 'bookmarkExport',
        loadComponent: () =>
          import('src/view/system/bookmark-export/index.component'),
      },
      {
        path: 'collect',
        loadComponent: () => import('src/view/system/collect/index.component'),
      },
      {
        path: 'auth',
        loadComponent: () => import('src/view/system/auth/index.component'),
      },
      {
        path: 'tag',
        loadComponent: () => import('src/view/system/tag/index.component'),
      },
      {
        path: 'search',
        loadComponent: () => import('src/view/system/search/index.component'),
      },
      {
        path: 'setting',
        loadComponent: () => import('src/view/system/setting/index.component'),
      },
      {
        path: 'component',
        loadComponent: () =>
          import('src/view/system/component/index.component'),
      },
      {
        path: 'web',
        loadComponent: () => import('src/view/system/web/index.component'),
      },
      {
        path: 'config',
        loadComponent: () => import('src/view/system/config/index.component'),
      },
      {
        path: '**',
        redirectTo: '/system/web',
      },
    ],
  },
]

// 自有部署异步
if (!isSelfDevelop) {
  const defaultTheme = getDefaultTheme().toLowerCase()
  const hasDefault = routes.find((item) => item.path === defaultTheme)
  if (hasDefault) {
    routes.push({
      ...hasDefault,
      path: '**',
    })
  } else {
    routes.push({
      path: '**',
      redirectTo: '/' + defaultTheme,
    })
  }
}
