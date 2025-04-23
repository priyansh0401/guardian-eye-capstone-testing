"use client"

import { CameraCard } from "@/components/camera-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { useCameras } from "@/hooks/use-cameras"
import { Camera, Plus, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { user } = useAuth()
  const { cameras, isLoading, error, refetch } = useCameras()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Setup WebSocket connection for alerts
  useEffect(() => {
    if (!user) return

    // In a real app, this would connect to a real WebSocket server
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const wsHost = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace(/^https?:\/\//, "").replace("/api", "")
      : "localhost:8000"
    const wsUrl = `${wsProtocol}//${wsHost}/ws/alerts/${user.id}/`

    let ws: WebSocket | null = null

    try {
      ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log("WebSocket connection established")
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)

        // Play sound (in a real app)
        // const sound = new Howl({ src: ['/sounds/alert.mp3'] })
        // sound.play()

        toast({
          title: `Alert: ${data.alert_type}`,
          description: `Camera: ${data.camera_name} - ${data.message}`,
          variant: "destructive",
        })
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
      }

      ws.onclose = () => {
        console.log("WebSocket connection closed")
      }
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error)
    }

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [user, toast])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  // Filter cameras based on active tab
  const filteredCameras = cameras?.filter((camera) => {
    if (activeTab === "all") return true
    if (activeTab === "online") return camera.status === "online"
    if (activeTab === "offline") return camera.status === "offline"
    return true
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name?.split(" ")[0] || "User"}</h1>
          <p className="text-muted-foreground">Monitor and manage your security cameras</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/dashboard/add-camera">
            <Button size="sm" className="rounded-full" variant="gradient">
              <Plus className="mr-2 h-4 w-4" />
              Add Camera
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Cameras</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cameras?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {cameras?.filter((c) => c.status === "online").length || 0} online
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Motion Alerts</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+5 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sound Alerts</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">-2 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42.8 GB</div>
              <p className="text-xs text-muted-foreground">68% of available space</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Cameras</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="offline">Offline</TabsTrigger>
            </TabsList>
            <p className="text-sm text-muted-foreground">{filteredCameras?.length || 0} cameras</p>
          </div>
          <TabsContent value="all" className="mt-4">
            {renderCameraContent(filteredCameras, isLoading, error)}
          </TabsContent>
          <TabsContent value="online" className="mt-4">
            {renderCameraContent(filteredCameras, isLoading, error)}
          </TabsContent>
          <TabsContent value="offline" className="mt-4">
            {renderCameraContent(filteredCameras, isLoading, error)}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

function renderCameraContent(cameras: any[], isLoading: boolean, error: any) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[280px] rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="aspect-video w-full rounded-md bg-muted/50 mb-4"></div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p>Error loading cameras: {error.message}</p>
      </motion.div>
    )
  }

  if (cameras && cameras.length > 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cameras.map((camera, index) => (
          <CameraCard key={camera.id} camera={camera} index={index} />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Camera className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No cameras found</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        You haven&apos;t added any cameras yet. Add your first camera to start monitoring.
      </p>
      <Link href="/dashboard/add-camera" className="mt-4">
        <Button className="rounded-full" variant="gradient">
          <Plus className="mr-2 h-4 w-4" />
          Add Camera
        </Button>
      </Link>
    </motion.div>
  )
}
