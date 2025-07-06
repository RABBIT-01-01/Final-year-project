import AsyncStorage from "@react-native-async-storage/async-storage"

const REPORTS_STORAGE_KEY = "@road_reports"

export const saveReport = async (reportData) => {
  try {
    // Get existing reports
    const existingReports = await getReports()

    // Add new report with unique ID
    const newReport = {
      ...reportData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: "Submitted",
    }

    const updatedReports = [newReport, ...existingReports]

    // Save to AsyncStorage
    await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports))

    return newReport
  } catch (error) {
    console.error("Error saving report:", error)
    throw error
  }
}

export const getReports = async () => {
  try {
    const reportsJson = await AsyncStorage.getItem(REPORTS_STORAGE_KEY)
    return reportsJson ? JSON.parse(reportsJson) : []
  } catch (error) {
    console.error("Error getting reports:", error)
    return []
  }
}

export const deleteReport = async (reportId) => {
  try {
    const existingReports = await getReports()
    const updatedReports = existingReports.filter((report) => report.id !== reportId)
    await AsyncStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports))
    return true
  } catch (error) {
    console.error("Error deleting report:", error)
    throw error
  }
}

export const clearAllReports = async () => {
  try {
    await AsyncStorage.removeItem(REPORTS_STORAGE_KEY)
    return true
  } catch (error) {
    console.error("Error clearing reports:", error)
    throw error
  }
}
