# Budget and Cost Alarms for Frontend (CloudFront + S3)

# SNS Topic for cost alerts
resource "aws_sns_topic" "cost_alerts" {
  name         = "${var.project_name}-frontend-cost-alerts"
  display_name = "DespachaZap Frontend Cost Alerts"

  tags = {
    Name        = "${var.project_name}-frontend-cost-alerts"
    Environment = var.environment
    Project     = var.project_name
  }
}

# SNS Topic Subscription - Email notification
resource "aws_sns_topic_subscription" "cost_alerts_email" {
  topic_arn = aws_sns_topic.cost_alerts.arn
  protocol  = "email"
  endpoint  = var.cost_alert_email
}

# AWS Budget for monthly costs
resource "aws_budgets_budget" "monthly_cost" {
  name              = "${var.project_name}-frontend-monthly-budget"
  budget_type       = "COST"
  limit_amount      = var.monthly_budget_limit
  limit_unit        = "USD"
  time_unit         = "MONTHLY"
  time_period_start = "2026-01-01_00:00"

  cost_filter {
    name = "Service"
    values = [
      "Amazon CloudFront",
      "Amazon Simple Storage Service",
      "AWS Certificate Manager"
    ]
  }

  # Alert at 80% of budget
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.cost_alert_email]
    subscriber_sns_topic_arns  = [aws_sns_topic.cost_alerts.arn]
  }

  # Alert at 100% of budget
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.cost_alert_email]
    subscriber_sns_topic_arns  = [aws_sns_topic.cost_alerts.arn]
  }

  # Forecasted alert at 100%
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.cost_alert_email]
    subscriber_sns_topic_arns  = [aws_sns_topic.cost_alerts.arn]
  }

  tags = {
    Name        = "${var.project_name}-frontend-monthly-budget"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Daily budget to catch anomalies quickly
resource "aws_budgets_budget" "daily_cost" {
  name              = "${var.project_name}-frontend-daily-budget"
  budget_type       = "COST"
  limit_amount      = var.daily_budget_limit
  limit_unit        = "USD"
  time_unit         = "DAILY"
  time_period_start = "2026-01-01_00:00"

  cost_filter {
    name = "Service"
    values = [
      "Amazon CloudFront",
      "Amazon Simple Storage Service",
      "AWS Certificate Manager"
    ]
  }

  # Alert when daily cost exceeds threshold
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.cost_alert_email]
    subscriber_sns_topic_arns  = [aws_sns_topic.cost_alerts.arn]
  }

  tags = {
    Name        = "${var.project_name}-frontend-daily-budget"
    Environment = var.environment
    Project     = var.project_name
  }
}
