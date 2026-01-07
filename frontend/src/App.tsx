import { MainLayout } from '@/components/layout'
import {
  ChatView,
  DashboardView,
  NetworkView,
  ModelsView,
  SettingsView,
} from '@/components/features'
import { useAppStore } from '@/store/appStore'
import { TooltipProvider } from '@/components/ui/tooltip'

function App() {
  const { activeTab } = useAppStore()

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatView />
      case 'dashboard':
        return <DashboardView />
      case 'network':
        return <NetworkView />
      case 'models':
        return <ModelsView />
      case 'settings':
        return <SettingsView />
      default:
        return <ChatView />
    }
  }

  return (
    <TooltipProvider>
      <MainLayout>{renderContent()}</MainLayout>
    </TooltipProvider>
  )
}

export default App
