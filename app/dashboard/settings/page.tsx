"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"

const notificationSchema = z.object({
  enableEmailNotifications: z.boolean().default(true),
  enablePushNotifications: z.boolean().default(true),
  enableSoundAlerts: z.boolean().default(true),
  motionDetectionSensitivity: z.number().min(0).max(100),
  soundDetectionSensitivity: z.number().min(0).max(100),
})

const securitySchema = z.object({
  enableTwoFactor: z.boolean().default(false),
  loginNotifications: z.boolean().default(true),
  sessionTimeout: z.enum(["15min", "30min", "1hour", "4hours", "never"]),
  apiKey: z.string().optional(),
})

type NotificationFormValues = z.infer<typeof notificationSchema>
type SecurityFormValues = z.infer<typeof securitySchema>

export default function SettingsPage() {
  const [isNotificationLoading, setIsNotificationLoading] = useState(false)
  const [isSecurityLoading, setIsSecurityLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      enableEmailNotifications: true,
      enablePushNotifications: true,
      enableSoundAlerts: true,
      motionDetectionSensitivity: 70,
      soundDetectionSensitivity: 60,
    },
  })

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      enableTwoFactor: false,
      loginNotifications: true,
      sessionTimeout: "1hour",
      apiKey: "sk_live_51HG8h2CkB5JQh8xgN8vKWW3Vb1zKX5JuZ",
    },
  })

  async function onNotificationSubmit(data: NotificationFormValues) {
    try {
      setIsNotificationLoading(true)
      // In a real app, this would call the API to update settings
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Settings Updated",
        description: "Your notification settings have been updated successfully",
      })
    } catch (error) {
      console.error("Failed to update settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsNotificationLoading(false)
    }
  }

  async function onSecuritySubmit(data: SecurityFormValues) {
    try {
      setIsSecurityLoading(true)
      // In a real app, this would call the API to update settings
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Settings Updated",
        description: "Your security settings have been updated successfully",
      })
    } catch (error) {
      console.error("Failed to update settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSecurityLoading(false)
    }
  }

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
    <motion.div className="w-full" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={itemVariants} className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4 pt-4">
            <Card className="w-full shadow-sm">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you want to receive alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="enableEmailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>Receive alerts via email when events are detected</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="enablePushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Push Notifications</FormLabel>
                              <FormDescription>Receive push notifications on your devices</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="enableSoundAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Sound Alerts</FormLabel>
                              <FormDescription>Play sound when alerts are received</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Detection Sensitivity</h3>

                      <FormField
                        control={notificationForm.control}
                        name="motionDetectionSensitivity"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Motion Detection Sensitivity</FormLabel>
                              <span className="w-12 rounded-md border border-input px-2 py-0.5 text-center text-sm text-muted-foreground">
                                {field.value}%
                              </span>
                            </div>
                            <FormControl>
                              <Slider
                                min={0}
                                max={100}
                                step={1}
                                defaultValue={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                              />
                            </FormControl>
                            <FormDescription>Higher sensitivity may result in more false positives</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="soundDetectionSensitivity"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Sound Detection Sensitivity</FormLabel>
                              <span className="w-12 rounded-md border border-input px-2 py-0.5 text-center text-sm text-muted-foreground">
                                {field.value}%
                              </span>
                            </div>
                            <FormControl>
                              <Slider
                                min={0}
                                max={100}
                                step={1}
                                defaultValue={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                              />
                            </FormControl>
                            <FormDescription>Higher sensitivity may result in more false positives</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isNotificationLoading} variant="gradient">
                        {isNotificationLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 pt-4">
            <Card className="w-full shadow-sm">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security options for your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={securityForm.control}
                        name="enableTwoFactor"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                              <FormDescription>Add an extra layer of security to your account</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={securityForm.control}
                        name="loginNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Login Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications when someone logs into your account
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={securityForm.control}
                      name="sessionTimeout"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Session Timeout</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="15min" />
                                </FormControl>
                                <FormLabel className="font-normal">15 minutes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="30min" />
                                </FormControl>
                                <FormLabel className="font-normal">30 minutes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="1hour" />
                                </FormControl>
                                <FormLabel className="font-normal">1 hour</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="4hours" />
                                </FormControl>
                                <FormLabel className="font-normal">4 hours</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="never" />
                                </FormControl>
                                <FormLabel className="font-normal">Never</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>How long until your session expires due to inactivity</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input {...field} type="password" placeholder="Your API key" />
                              <Button type="button" variant="outline" size="sm">
                                Regenerate
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>Your API key for integrating with other services</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSecurityLoading} variant="gradient">
                        {isSecurityLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
