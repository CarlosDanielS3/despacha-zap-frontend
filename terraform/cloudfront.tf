# CloudFront Function to add API key
resource "aws_cloudfront_function" "api_key_injector" {
  name    = "${var.project_name}-api-key-injector"
  runtime = "cloudfront-js-1.0"
  comment = "Injects API key header for backend requests"
  publish = true
  code    = templatefile("${path.module}/cloudfront-function.js", {
    api_key = var.api_key
  })
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} distribution"
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # Use only North America and Europe
  
  aliases = var.domain_name != "" ? [var.domain_name] : []

  # Origin for S3 (frontend)
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-${var.project_name}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }

  # Origin for API Gateway
  origin {
    domain_name = var.api_gateway_url
    origin_id   = "APIGateway-${var.project_name}"
    origin_path = "/${var.api_gateway_stage}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
      origin_read_timeout    = 60
      origin_keepalive_timeout = 5
    }
  }

  # Default behavior for frontend (S3)
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.project_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # Behavior for API requests
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "APIGateway-${var.project_name}"

    # Attach CloudFront Function to inject API key
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.api_key_injector.arn
    }

    forwarded_values {
      query_string = true
      headers      = ["Accept", "Content-Type"]
      
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "https-only"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
  }

  # Custom error response for SPA routing
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.domain_name == ""
    acm_certificate_arn            = var.domain_name != "" ? aws_acm_certificate.cert[0].arn : null
    ssl_support_method             = var.domain_name != "" ? "sni-only" : null
    minimum_protocol_version       = var.domain_name != "" ? "TLSv1.2_2021" : "TLSv1"
  }

  tags = {
    Name        = "${var.project_name}-distribution"
    Environment = var.environment
  }
}
