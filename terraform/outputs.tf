output "cloudfront_url" {
  description = "CloudFront distribution URL"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.main.id
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.frontend.id
}

output "website_url" {
  description = "Website URL"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.main.domain_name}"
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name for DNS configuration"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "route53_nameservers" {
  description = "Route53 nameservers (if using Route53)"
  value       = var.domain_name != "" ? aws_route53_zone.main[0].name_servers : null
}

output "certificate_status" {
  description = "Certificate validation status"
  value       = var.domain_name != "" ? "Certificate validated and DNS configured automatically!" : "No custom domain configured"
}
