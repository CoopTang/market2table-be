class ForecastSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :timezone, :currently, :hourly, :daily
end
