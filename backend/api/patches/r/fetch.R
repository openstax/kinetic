library(jsonlite)
library(httr)

#' Prepare and fetch response download
#'
#' @description
#' Prepare and fetch response download
#'
#' @param api_key Api key of the analysis.
#' @param cutoff_date A character string specifying the cutoff date in the format "YYYY-MM-DD".
#'     Only responses occring before this date will be included
#' @param base_path (optional) path to server api.  Only should be set if instructed by support in order to test using development code
#' @return list containing the names of  downloaded files.  Array will be empty if no responses were recorded
#' @export
fetch_kinetic_responses <- function(cutoff_date, base_path = "https://kinetic.openstax.org/api/v1") {
  api_key <- Sys.getenv("ANALYSIS_API_KEY")
  bearer_token <- Sys.getenv("ENCLAVE_API_KEY")
  headers <- c('User-Agent' = 'Kinetic API')
  if (nchar(bearer_token) > 0) {
    headers <- c(headers, `Authorization` = paste0("Bearer ", bearer_token))
  }
  api_client <- ApiClient$new(base_path = base_path, default_headers = headers)

  api_instance <- DefaultApi$new(api_client = api_client)
  delay <- 1
  downloaded_files <- list()

  while(TRUE) {
    response <- tryCatch(
      api_instance$get_response_download(api_key, cutoff_date),
      ApiException = function(ex) ex
    )

    if(!is.null(response$ApiException)) {
      cat(response$ApiException$toString())
      return(downloaded_files)
    }
    status <- response$status

    if (status == "error") {
      stop("api returned error")
    }

    if(status == "complete" && !is.null(response$response_urls)) {
      urls <- response$response_urls
      for(url in urls) {
        filename <- basename(url)
        download.file(url, filename)
        downloaded_files[[length(downloaded_files)+1]] <- filename
      }
      break
    }

    Sys.sleep(delay) # wait for the current delay before trying again
    delay <- min(delay * 2, 60) # double the delay, up to a maximum of 60 seconds
  }
  return(downloaded_files)
}
