variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "despacha-zap"
}

variable "domain_name" {
  description = "Custom domain name (optional)"
  type        = string
  default     = ""
}

variable "api_gateway_url" {
  description = "API Gateway base URL"
  type        = string
  default     = "your-api-gateway.execute-api.region.amazonaws.com"
}

variable "api_gateway_stage" {
  description = "API Gateway stage"
  type        = string
  default     = "production"
}

variable "api_key" {
  description = "API key for backend authentication"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Environment (dev, staging, production)"
  type        = string
  default     = "production"
}

# Cost Monitoring Variables
variable "cost_alert_email" {
  description = "Email address to receive cost alerts"
  type        = string
}

variable "monthly_budget_limit" {
  description = "Monthly budget limit in USD for frontend (CloudFront + S3)"
  type        = string
  default     = "10"
}

variable "daily_budget_limit" {
  description = "Daily budget limit in USD for frontend"
  type        = string
  default     = "1"
}
